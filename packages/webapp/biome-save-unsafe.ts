import { exec } from "node:child_process"
import path from "node:path"
import type { Plugin } from "vite"

function runCommand(command: string, reverse = false): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (reverse && !stderr) {
        reject(new Error(`Error: \n${stderr}`))
      } else {
        resolve(stdout)
      }
    })
  })
}

export default function biomePlugin(): Plugin {
  let isProcessing = false

  return {
    name: "vite-plugin-biome",
    // @ts-ignore
    async handleHotUpdate({ file, server }) {
      file = file.replace(/\$/g, "\\$")
      if (isProcessing) return
      if (
        file.endsWith(".tsx") ||
        file.endsWith(".jsx") ||
        file.endsWith(".ts")
      ) {
        isProcessing = true
        try {
          // First, run biome lint to check for errors
          await runCommand(`biome lint "${file}"`, true)

          // If lint fails, run biome check --write
          await runCommand(`biome check --write --unsafe "${file}"`)

          console.log(`Formatted ${path.basename(file)} successfully`)

          // Invalidate the module to trigger a reload
          // const module = server.moduleGraph.getModuleById(file)
          // if (module) {
          //   server.moduleGraph.invalidateModule(module)
          //   return [module]
          // }
        } catch (error) {
          // @ts-ignore
          // console.error(`Plugin error: ${error.message}`);
        } finally {
          isProcessing = false
        }
      }
    },
  }
}
