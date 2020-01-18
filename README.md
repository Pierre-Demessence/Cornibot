# CorniBot

## Requirements

* NodeJS 10.x, 12.x, 13.x (<https://nodejs.org/)>

## Setup

1) Install the required packages.

    ```bash
    npm install
    ```

2) Copy `config.sample.json`, rename it to `config.json` and fill it.

## Usage

* `npm run serve` to launch the bot.
* `npm run serve:watch` to launch and watch the bot, restarting it automatically on code change.
* `npm run serve:prod` to launch the bot in production.
* `npm run build` to build the bot for production.
* `npm run test` to run the tests.
* `npm run test:coverage` to check the test coverage.
* `npm run lint` to run the linter.
* `npm run lint:fix` to run the linter and automatically fix some issues.

## File Structure

```bash
.
├── .github/        # Github Actions configs
├── assets/         # Static assets (images, etc...)
├── dist/           # Build target directory
└── src/            # Source of the project
    ├── Commands/   # Commands files. One subdirectoy per CommandGroup (User, Moderation, Fun, etc...) and one file per Command.
    ├── Engine/     # Main code of the bot.
    └── Utils/      # Utility code that is not dependant on the bot.
```
