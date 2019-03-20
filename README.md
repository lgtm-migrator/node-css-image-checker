# node-css-image-checker
Checks if all images in a local CSS file exists

## What does it do?
css-image-checker can check CSS files for invalid referenced images

## Usage
```
npm install -g node-css-image-checker
css-image-checker --folder '/www-folder'
```

## Example

Consider the following code:
```
#logo a {
    background: url(logo.png) no-repeat -42px -271px;
}
```
but you only have `logo.jpg` image available.

Running `css-image-checker --folder '/www-folder'`

The output will be:

```
Error found in: style.css
Full path not found: /www-folder/logo.png
Path in CSS file: logo.png

Number of errors: 1
```

## Exit codes
```
0 = No errors
1 = Errors were founds in the CSS files
2 = No folder were specified on command line
3 = Folder specified does not exists
4 = Folder specified is not a folder
```

## Continuous Integration
css-image-checker can be used in CI envionments to check your CSS files before merging a pull request

## Badges

[![CircleCI](https://circleci.com/gh/gemal/node-css-image-checker.svg?style=svg)](https://circleci.com/gh/gemal/node-css-image-checker)

[![codecov](https://codecov.io/gh/gemal/node-css-image-checker/branch/master/graph/badge.svg)](https://codecov.io/gh/gemal/node-css-image-checker)

[![Total alerts](https://img.shields.io/lgtm/alerts/g/gemal/node-css-image-checker.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/gemal/node-css-image-checker/alerts/)
