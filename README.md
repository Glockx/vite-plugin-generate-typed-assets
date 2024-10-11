# Vite Plugin: Generate Assets

[![npm version](https://img.shields.io/npm/v/vite-plugin-generate-typed-assets.svg)](https://www.npmjs.com/package/vite-plugin-generate-typed-assets)
[![license](https://img.shields.io/npm/l/vite-plugin-generate-typed-assets.svg)](https://github.com/Glockx/vite-plugin-generate-typed-assets/blob/main/LICENSE)

A Vite plugin that automatically generates TypeScript asset index files (`index.ts` and `index.d.ts`) for your assets directory, complete with type definitions. It watches for changes in your assets folder and updates the index files accordingly, providing a seamless way to manage and import your assets with full type safety and autocomplete support.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Example](#example)
- [Integration with React and Vite](#integration-with-react-and-vite)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Automatic Index Generation**: Generates `index.ts` and `index.d.ts` files for your assets directory.
- **Type Definitions**: Provides TypeScript type definitions for strong typing and autocomplete.
- **Asset Watching**: Watches for changes in the assets directory and regenerates index files automatically.
- **Customizable**: Configurable options for assets directory, output file, and supported asset extensions.
- **Seamless Integration**: Works with Vite's build and development processes.

## Installation

Install the plugin via npm:

```bash
npm install vite-plugin-generate-typed-assets --save-dev
```

## Usage

1. Add the plugin to your <code>vite.config.ts</code> file:

   ```typescript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react-swc";
   import generateAssetsPlugin from "vite-plugin-generate-typed-assets";
   import path from "path";

   export default defineConfig({
     plugins: [
       react(),
       generateAssetsPlugin({
         assetsDir: path.resolve(__dirname, "src/assets"),
         outputFile: path.resolve(__dirname, "src/assets/index.ts"),
         assetExtensions: [
           ".png",
           ".jpg",
           ".jpeg",
           ".svg",
           ".gif",
           ".webp",
           ".mp3",
           ".json",
         ],
       }),
     ],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "src"),
       },
     },
   });
   ```

2. Add given settings to <code>tsconfig.app.json</code>:
   ```typescript
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
   ```

## Options

The <code>generateAssetsPlugin</code> function accepts an options object with the following properties:

- <p><strong><code>assetsDir</code></strong>: (string) The directory containing your assets. Default: <code>'src/assets'</code>.</p>
- <p><strong><code>outputFile</code></strong>: (string) The file path for the generated TypeScript index file. Default: <code>'src/assets/index.ts'</code>.</p>
- <p><strong><code>assetExtensions</code></strong>: (string[]) An array of file extensions to include in the asset index. Default:</p>

```typescript
[".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp", ".mp3", ".json"];
```

### Example Options

```typescript
generateAssetsPlugin({
  assetsDir: path.resolve(__dirname, "src/assets"),
  outputFile: path.resolve(__dirname, "src/assets/index.ts"),
  assetExtensions: [".png", ".jpg", ".jpeg", ".svg"],
});
```

## Example

Assuming your assets directory has the following structure:

```css
src/assets/
├── Images/
│   ├── Header/
│   │   ├── close.svg
│   │   ├── home.svg
│   │   └── more.svg
│   └── Sidebar/
│       ├── logo.png
│       └── menu.svg
└── react.svg
```

After running the Vite dev server with the plugin configured, the plugin will generate <code>index.ts</code> and <code>index.d.ts</code> files in <code>src/assets/</code>.

### Generated <code>index.ts</code>

```typescript
export const Images = {
  Header: {
    close: new URL("./Images/Header/close.svg", import.meta.url).href,
    home: new URL("./Images/Header/home.svg", import.meta.url).href,
    more: new URL("./Images/Header/more.svg", import.meta.url).href,
  },
  Sidebar: {
    logo: new URL("./Images/Sidebar/logo.png", import.meta.url).href,
    menu: new URL("./Images/Sidebar/menu.svg", import.meta.url).href,
  },
};

export const react = new URL("./react.svg", import.meta.url).href;
```

### Generated <code>index.d.ts</code>:

```typescript
export const Images: {
  Header: {
    close: string;
    home: string;
    more: string;
  };

  Sidebar: {
    logo: string;
    menu: string;
  };
};

export const react: string;
```

## Integration with React and Vite

Here's how you can use the generated assets in your React components:

### Step 1: Import the Assets

```typescript
import { Images, react } from "@/assets";
```

### Step 2: Use in Components

```tsx
function Header() {
  return (
    <header>
      <img src={Images.Header.close} alt="Close" />
      <img src={Images.Header.home} alt="Home" />
      <img src={Images.Header.more} alt="More" />
    </header>
  );
}

function Sidebar() {
  return (
    <aside>
      <img src={Images.Sidebar.logo} alt="Logo" />
      <img src={Images.Sidebar.menu} alt="Menu" />
    </aside>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <img src={react} alt="React Logo" />
    </div>
  );
}

export default App;
```

### Notes:

<li><strong>Type Safety</strong>: With the generated <code>index.d.ts</code>, you get full type safety and autocomplete in your IDE.</li>

<li><strong>Asset Loading</strong>: Assets are loaded on-demand, optimizing your application's performance.</li>

## Contributing

<p>Contributions are welcome! If you have ideas for improvements or encounter any issues, please open an issue or submit a pull request on the Github Repository.</p>

### Development Setup

1. Clone the Repository:

   ```bash
   git clone https://github.com/glockx/vite-plugin-generate-typed-assets.git
   cd vite-plugin-generate-typed-assets
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Build the Plugin:
   ```bash
   npm run build
   ```

# License

This project is licensed under the MIT License - see the LICENSE file for details
