import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';
// import nestjsPlugin from 'eslint-plugin-nestjs'; // Opcional: Descomentar si lo instalas

export default tseslint.config(
  {
    // 🧹 Ignorar archivos de build y config
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**', 'coverage/**'],
  },

  // 🧱 Configs base (el orden importa)
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // ...nestjsPlugin.configs.recommended, // Opcional: Descomentar si lo instalas
  eslintPluginPrettierRecommended, // Debe ser el último para anular reglas de estilo

  {
    // ⚙️ Opciones de lenguaje y entorno global
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    // 🔥 Reglas personalizadas y estrictas para NestJS / TypeScript
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      // 'nestjs': nestjsPlugin, // Opcional
    },
    rules: {
      // --- ORDEN DE IMPORTS ---
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Todos los imports juntos, sin líneas en blanco entre grupos
            ['^\\u0000', '^@?\\w', '^', '^[./]'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // --- CALIDAD DE CÓDIGO AÑADIDA ---
      'prefer-const': 'error', // Usa 'const' por defecto
      eqeqeq: 'error', // Obliga a usar '==='
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Permite solo warn y error
      'no-return-await': 'error', // Evita el redundante 'return await'
      yoda: 'error', // Evita las 'Yoda conditions'

      // --- REGLAS DE TYPESCRIPT ---
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'warn',

      // --- NAMING CONVENTION ---
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE'],
          leadingUnderscore: 'allow',
        },
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'property',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
          filter: { regex: '(@|\\/)', match: false }, // Permite excepciones para decoradores
        },
      ],

      // --- IMPORTS Y VARIABLES NO USADAS (Plugin) ---
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // --- REGLAS DE NESTJS (Opcional) ---
      // 'nestjs/use-injectable-decorator': 'error',
      // 'nestjs/no-missing-module-exports': 'warn',
    },
  },
);
