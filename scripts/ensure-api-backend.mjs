import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const apiRoot = path.join(repoRoot, "apps", "api");
const apiPackageJson = path.join(apiRoot, "package.json");

const files = new Map([
  [
    "package.json",
    JSON.stringify(
      {
        name: "@ndp_tests/api",
        private: true,
        scripts: {
          "start:dev": "nest start --watch",
          build: "nest build",
          start: "node dist/main.js",
          lint: 'tsc --noEmit && eslint "src/**/*.ts"'
        },
        dependencies: {
          "@nestjs/common": "^11.0.0",
          "@nestjs/core": "^11.0.0",
          "@nestjs/platform-express": "^11.0.0",
          "reflect-metadata": "^0.2.2",
          rxjs: "^7.8.1"
        },
        devDependencies: {
          "@nestjs/cli": "^11.0.0",
          "@nestjs/schematics": "^11.0.0",
          "@types/node": "^22.0.0",
          eslint: "^9.0.0",
          typescript: "^5.7.0"
        }
      },
      null,
      2
    ) + "\n"
  ],
  ["nest-cli.json", JSON.stringify({ collection: "@nestjs/schematics", sourceRoot: "src" }, null, 2) + "\n"],
  [
    "tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          module: "commonjs",
          declaration: true,
          removeComments: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          allowSyntheticDefaultImports: true,
          target: "ES2022",
          sourceMap: true,
          outDir: "./dist",
          baseUrl: "./",
          incremental: true,
          strict: true,
          skipLibCheck: true
        },
        include: ["src/**/*.ts"]
      },
      null,
      2
    ) + "\n"
  ],
  [
    "src/main.ts",
    `import { ValidationPipe } from "@nestjs/common";\nimport { NestFactory } from "@nestjs/core";\nimport { AppModule } from "./app.module";\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  app.setGlobalPrefix("api");\n  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));\n  await app.listen(process.env.PORT ?? 4000);\n}\nvoid bootstrap();\n`
  ],
  [
    "src/app.module.ts",
    `import { Module } from "@nestjs/common";\nimport { HealthController } from "./health.controller";\n\n@Module({\n  controllers: [HealthController]\n})\nexport class AppModule {}\n`
  ],
  [
    "src/health.controller.ts",
    `import { Controller, Get } from "@nestjs/common";\n\n@Controller("health")\nexport class HealthController {\n  @Get()\n  health() {\n    return { status: "ok" };\n  }\n}\n`
  ]
]);

async function createBackend() {
  await mkdir(apiRoot, { recursive: true });

  for (const [relativePath, contents] of files) {
    const target = path.join(apiRoot, relativePath);
    if (existsSync(target)) continue;
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, contents, "utf8");
  }
}

if (existsSync(apiPackageJson)) {
  console.log("Backend NestJS już istnieje w apps/api — pomijam automatyczne tworzenie.");
} else {
  await createBackend();
  console.log("Utworzono minimalny backend NestJS w apps/api.");
}
