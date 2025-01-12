import * as path from 'path'
import ts from 'typescript'

const buildTypescript = async (
  override: {
    compilerOptions?: ts.CompilerOptions
    include?: string[]
    exclude?: string[]
    files?: string[]
    extends?: string
  } = {},
  currentDir = process.cwd()
) => {
  const configFile = ts.findConfigFile(currentDir, ts.sys.fileExists, 'tsconfig.json')
  if (!configFile) throw Error('tsconfig.json not found')
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile)

  config.compilerOptions = Object.assign({}, config.compilerOptions, override.compilerOptions)
  if (override.include) config.include = override.include
  if (override.exclude) config.exclude = override.exclude
  if (override.files) config.files = override.files
  if (override.extends) config.files = override.extends

  const { options, fileNames, errors } = ts.parseJsonConfigFileContent(config, ts.sys, currentDir)

  const program = ts.createProgram({ options, rootNames: fileNames, configFileParsingDiagnostics: errors })

  const { diagnostics, emitSkipped } = program.emit()

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(diagnostics, errors)

  if (allDiagnostics.length) {
    const formatHost: ts.FormatDiagnosticsHost = {
      getCanonicalFileName: (path) => path,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    }
    const message = ts.formatDiagnostics(allDiagnostics, formatHost)
    console.warn(message)
  }

  if (emitSkipped) process.exit(1)
}

export { buildTypescript };
