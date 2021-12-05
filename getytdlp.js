import inquirer from "inquirer";
import { downloadRelease } from "@terascope/fetch-github-release"

async function menu() {
    inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'Select your current platform.',
                    choices: ['🪟 Windows (x64)', '🪟 Windows (x86)', '🐧 Linux', '🛑 Exit'],
                    filter(val) {
                    return val.toLowerCase();
                    },
                },
            ])
            .then((answers) => {
                globalThis.choice = answers.choice // Make choice global because javascript is cool
                handleMenuResponse(answers)
            })
            .catch((error) => {
                throw error;
    });
}

// Define a function to filter releases.
function filterRelease(release) {
    // Filter out prereleases.
    return release.prerelease === false;
  }
  
// Define a function to filter assets.
function filterAssetYtdlp(asset) {
    switch (globalThis.choice) {
        case 'windows (x64)':
            return asset.name === 'yt-dlp.exe';
            break;
        case 'windows (x86)':
            return asset.name === 'yt-dlp_x86.exe';
            break;
        case 'linux':
            return asset.name === 'yt-dlp'
            break;
        default:
            console.error('Asset filter error; check filterAsset.')
    }
}

function filterAssetFfmpeg(asset) {
    switch (globalThis.choice) {
        case 'windows (x64)':
            return asset.name === 'win64-gpl.zip';
            break;
        case 'windows (x86)':
            return asset.name === 'win32-gpl.zip';
            break;
        case 'linux':
            return asset.name === 'linux64-gpl'
            break;
        default:
            console.error('Asset filter error; check filterAsset.')
    }
}

async function handleMenuResponse(a) {
    console.clear();
    switch (a.choice) {
        case '🪟 windows (x64)':
            console.log('Downloading YT-DLP for Windows x64!')
            downloadRelease('yt-dlp', 'yt-dlp', '.', filterRelease, filterAssetYtdlp, true, false)
                .then(function() {
                    console.log('All done!');
                })
                .catch(function(err) {
                    console.error(err.message);
            });
            break;
        case '🪟 windows (x86)':
            console.log('Downloading for Windows x86!')
            downloadRelease('yt-dlp', 'yt-dlp', '.', filterRelease, filterAssetYtdlp, true, false)
                .then(function() {
                    console.log('All done!');
                })
                .catch(function(err) {
                    console.error(err.message);
            });
            break;
        case '🐧 linux':
            console.log('Downloading for Linux!')
            downloadRelease('yt-dlp', 'yt-dlp', '.', filterRelease, filterAssetYtdlp, true, false)
                .then(function() {
                    console.log('All done!');
                })
                .catch(function(err) {
                    console.error(err.message);
                    menu();
            });
            break;
        case '🛑 exit':
            process.exit(0);
            break;
        default:
            console.log('Invalid option selected.')
            menu();
    }
}

menu();