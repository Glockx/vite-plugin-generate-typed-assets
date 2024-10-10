// src/index.ts

import { Plugin } from "vite";
import fs from "fs";
import path from "path";
import chokidar, { FSWatcher } from "chokidar";

export interface GenerateAssetsPluginOptions {
  assetsDir: string;
  outputFile: string;
  assetExtensions?: string[];
}

export default function generateAssetsPlugin(
  options: GenerateAssetsPluginOptions
): Plugin {
  const {
    assetsDir = "src/assets",
    outputFile = "src/assets/index.ts",
    assetExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".svg",
      ".gif",
      ".webp",
      ".mp3",
      ".json",
    ],
  } = options;

  const typesFile = outputFile.replace(/\.ts$/, ".d.ts");

  /**
   * Recursively walks through a directory and builds an object representing the asset structure.
   */
  function walkDir(dir: string, relativePath: string = ""): any {
    const items = fs.readdirSync(dir);
    const result: any = {};

    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const itemRelativePath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        result[item] = walkDir(fullPath, itemRelativePath);
      } else {
        const ext = path.extname(item).toLowerCase();
        if (assetExtensions.includes(ext)) {
          const name = path.basename(item, ext);
          const assetPath = "./" + itemRelativePath.replace(/\\/g, "/");
          result[name] = assetPath;
        }
      }
    });

    return result;
  }

  /**
   * Generates TypeScript code from the assets object using new URL().
   */
  function generateCode(
    assets: any,
    indent: string = "",
    isTopLevel: boolean = true
  ): string {
    let code = "";

    const entries = Object.entries(assets);

    entries.forEach(([key, value]) => {
      const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `'${key}'`;

      if (typeof value === "object") {
        if (isTopLevel) {
          code += `${indent}export const ${validKey} = {\n`;
        } else {
          code += `${indent}${validKey}: {\n`;
        }
        code += generateCode(value, indent + "  ", false);
        code += `${indent}}${isTopLevel ? ";\n\n" : ",\n"}`;
      } else {
        // Use new URL for assets
        const url = `new URL('${value}', import.meta.url).href`;
        if (isTopLevel) {
          code += `${indent}export const ${validKey} = ${url};\n\n`;
        } else {
          code += `${indent}${validKey}: ${url},\n`;
        }
      }
    });

    return code;
  }

  /**
   * Generates TypeScript type definitions from the assets object.
   */
  function generateTypes(
    assets: any,
    indent: string = "",
    isTopLevel: boolean = true
  ): string {
    let code = "";
    const entries = Object.entries(assets);

    entries.forEach(([key, value]) => {
      const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `'${key}'`;

      if (typeof value === "object") {
        if (isTopLevel) {
          code += `${indent}export const ${validKey}: {\n`;
        } else {
          code += `${indent}${validKey}: {\n`;
        }
        code += generateTypes(value, indent + "  ", false);
        code += `${indent}};\n\n`;
      } else {
        code += `${indent}${validKey}: string;\n`;
      }
    });
    return code;
  }

  /**
   * Main function to generate assets index files.
   */
  function generateAssets() {
    const assets = walkDir(assetsDir);

    // Generate the TypeScript code
    const code = generateCode(assets);

    // Write the code to the output file
    fs.writeFileSync(outputFile, code);

    console.log(`Assets index generated at ${outputFile}`);

    // Generate the TypeScript type definitions
    const types = generateTypes(assets);

    // Write the types to the .d.ts file
    fs.writeFileSync(typesFile, types);

    console.log(`Assets types generated at ${typesFile}`);
  }

  let watcher: FSWatcher;

  return {
    name: "vite-plugin-generate-typed-assets",
    apply: "serve",
    buildStart() {
      generateAssets();

      watcher = chokidar.watch(assetsDir, {
        ignored: [outputFile, typesFile],
        ignoreInitial: true,
      });

      watcher.on("add", () => {
        generateAssets();
      });

      watcher.on("unlink", () => {
        generateAssets();
      });

      watcher.on("change", () => {
        generateAssets();
      });
    },
    buildEnd() {
      if (watcher) {
        watcher.close();
      }
    },
  };
}
