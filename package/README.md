# @adrianjost/report-viewer

[![npm (scoped)](https://img.shields.io/npm/v/@adrianjost/report-viewer.svg) ![npm](https://img.shields.io/npm/dy/@adrianjost/report-viewer.svg)](https://www.npmjs.com/package/@adrianjost/report-viewer)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@adrianjost/report-viewer.svg)](https://bundlephobia.com/result?p=@adrianjost/report-viewer)

## Usage

Add the following things to your CI:

1. Install Upload Script `npm i -g @adrianjost/report-viewer`
2. set enviroment variables
3. run upload script `rv-upload -F test/output/**` (check CLI options below)

### Enviroment Variables

variable               | descripton
-----------------------|-------------------------------------------------------------------------------------
`REPORT_VIEWER_TOKEN`  | your personal authorization token. You can also pass it using the CLI
`REPORT_VIEWER_ORG`    | Git organization/username e.g. `adrianjost` for `https://github.com/adrianjost`
`REPORT_VIEWER_REPO`   | Git repo name e.g. `report-viewer` for `https://github.com/adrianjost/report-viewer`
`REPORT_VIEWER_BRANCH` | Git branch name e.g. `master`
`REPORT_VIEWER_COMMIT` | Git commit hash e.g. `35e32b6a00dec02ae7d7c45c6b7106779a124685`

**Note**: for the following CI services, you do not need to specify the variables `REPORT_VIEWER_ORG`, `REPORT_VIEWER_ORG`, `REPORT_VIEWER_ORG`, `REPORT_VIEWER_ORG`:
- [Travis-CI](https://travis-ci.com)
- [Circle-CI](https://circleci.com)
- [GitHub Actions](https://github.com/features/actions)

Feel free to contribute more by creating a pull request or issue.

### CLI Options

name                     | shorthand | required | description
-------------------------|:---------:|:--------:|---------------------------------------------------------------------------------------------------------
`--file`                 |   `-F`    |    ✔     | glob pattern for all files that should be uploaded
`--token`                |   `-T`    |    ❌     | your personal authorization token. You can also pass it as a enviroment variable (`REPORT_VIEWER_TOKEN`)
`--ignore`               |   `-I`    |    ❌     | glob pattern for all files matched by the file parameter that should not be uploaded
`--no-predefined-ignore` |           |    ❌     | if defined, the predefined ignore patterns get ignored


## Dev-Setup

```bash
# install dependencies
npm i

# initially build project
npm run build

# link bin script
npm link

# start developing
npm run dev

# test current build
rv-upload -F dist/*.js
```
