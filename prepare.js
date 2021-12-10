// Import some needed modules
import inquirer from "inquirer";
import { downloadRelease } from "@terascope/fetch-github-release"
import path from 'path'
import fs from "fs";

// Menu function; is called at the end of the file after all
// function definitions.
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
  
// Functions for selecting assets in the ytdlp and ffmpeg repos.
function filterAssetYtdlp(asset) {
    switch (globalThis.choice) {
        case '🪟 windows (x64)':
            return asset.name === 'yt-dlp.exe';
            break;
        case '🪟 windows (x86)':
            return asset.name === 'yt-dlp_x86.exe';
            break;
        case '🐧 linux':
            return asset.name === 'yt-dlp'
            break;
        default:
            break;
    }
}

function filterAssetFfmpeg(asset) {
    switch (globalThis.choice) {
        case '🪟 windows (x64)':
            return asset.name.includes('win64-gpl.zip');
            break;
        case '🪟 windows (x86)':
            return asset.name.includes('win32-gpl.zip');
            break;
        case '🐧 linux':
            return asset.name.includes('linux64-gpl.tar.xz');
            break;
        default:
            break;
    }
}

// Download functions.
async function downloadYtdlp(ans) {
    switch (ans.choice) {
        case '🪟 windows (x64)':
            downloadRelease('yt-dlp', 'yt-dlp', '.', filterRelease, filterAssetYtdlp, true, false)
                .then(function() {
                    console.log('YTDLP: Downloaded');
                })
                .catch(function(err) {
                    console.error(err.message);
            });
            break;
        case '🪟 windows (x86)':
            downloadRelease('yt-dlp', 'yt-dlp', '.', filterRelease, filterAssetYtdlp, true, false)
                .then(function() {
                    console.log('YTDLP: Downloaded');
                })
                .catch(function(err) {
                    console.error(err.message);
            });
            break;
        case '🐧 linux':
            downloadRelease('yt-dlp', 'yt-dlp', '.', filterRelease, filterAssetYtdlp, true, false)
                .then(function() {
                    console.log('YTDLP: Downloaded');
                })
                .catch(function(err) {
                    console.error(err.message);
                    menu();
            });
            break;
    }
}

async function downloadFfmpeg(ans) {
    switch (ans.choice) {
        case '🪟 windows (x64)':
            downloadRelease('yt-dlp', 'FFmpeg-Builds', '.', filterRelease, filterAssetFfmpeg, false, false)
                .then(function(a) {
                    fs.rename(path.basename(a[0], '.zip'), 'ffmpeg', (e) => { console.error(e) })
                    console.log('FFMPEG: Downloaded');
                })
                .catch(function(err) {
                    console.error(err.message);
            });
            break;
        case '🪟 windows (x86)':
            downloadRelease('yt-dlp', 'FFmpeg-Builds', '.', filterRelease, filterAssetFfmpeg, false, false)
                .then(function(a) {
                    fs.rename(path.basename(a[0], '.zip'), 'ffmpeg', (e) => { console.error(e) })
                    console.log('FFMPEG: Downloaded');
                })
                .catch(function(err) {
                    console.error(err.message);
            });
            break;
        case '🐧 linux':
            downloadRelease('yt-dlp', 'FFmpeg-Builds', '.', filterRelease, filterAssetFfmpeg, false, false)
                .then(function(a) {
                    console.log('FFMPEG: Downloaded');
                })
                .catch(function(err) {
                    console.error(err.message);
                    menu();
            });
            break;
    }
}

// Menu response handling
async function handleMenuResponse(a) {
    console.clear();
    switch (a.choice) {
        case '🪟 windows (x64)':
            await downloadYtdlp(a);
            await downloadFfmpeg(a);
            break;
        case '🪟 windows (x86)':
            await downloadYtdlp(a);
            await downloadFfmpeg(a);
            break;
        case '🐧 linux':
            await downloadYtdlp(a);
            await downloadFfmpeg(a);
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
