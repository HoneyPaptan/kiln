const registry = "https://www.soundcn.xyz/r"
const names = process.argv.slice(2)

function camel(name: string) {
  return name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

function field(content: string, key: string) {
  const match = content.match(new RegExp(`${key}:\\s*"?([^",\\n]+)"?`))
  if (!match) throw new Error(`No ${key} in the registry file`)
  return match[1].trim()
}

async function add(name: string) {
  const response = await fetch(`${registry}/${name}.json`)
  if (!response.ok) throw new Error(`${name}: registry answered ${response.status}`)
  const item = (await response.json()) as { files: { content: string }[] }
  const content = item.files[0].content
  const dataUri = content.match(/data:audio\/[a-z0-9]+;base64,[A-Za-z0-9+/=]+/)?.[0]
  if (!dataUri) throw new Error(`${name}: no audio in the registry file`)
  const id = camel(name)
  const file = [
    `import type { SoundAsset } from "../types"`,
    "",
    `const ${id}: SoundAsset = {`,
    `  name: "${name}",`,
    `  duration: ${Number(field(content, "duration"))},`,
    `  license: "${field(content, "license")}",`,
    `  author: "${field(content, "author")}",`,
    `  dataUri: "${dataUri}",`,
    "}",
    "",
    `export { ${id} }`,
    "",
  ].join("\n")
  await Bun.write(`src/system/sound/assets/${name}.ts`, file)
  console.log(`${name}: ${Math.round(dataUri.length / 1024)} KB`)
}

if (names.length === 0) throw new Error("Usage: bun scripts/sound.ts <name> [name]")
for (const name of names) await add(name)
