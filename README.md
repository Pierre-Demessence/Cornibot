# CorniBot

## Requirements

* NodeJS 12.x (<https://nodejs.org/>)

### Production-Only Requirements

* MongoDB <https://www.mongodb.com/download-center/community>

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
    ├── Commands/   # Commands interpret and answer to user commands. One subdirectoy per CommandGroup (User, Moderation, Fun, etc...) and one file per Command.
    ├── Engine/     # Main code of the bot.
    ├── Observers/  # Observers check user input based on an pattern and run code. One file per Observer.
    ├── Services/   # Services are launched at the start of the app and run without user input. One file per Service. They can be accessed from Commands and Observers.
    └── Utils/      # Utility code that is not dependant on the bot.
```

## Notes

* There's an in-memory mongodb database for development, so you don't have to install anything. (But everything will be reset when the program is stopped.)
* To ease development with mongodb it's recommended to install Compass (<https://www.mongodb.com/products/compass>).
