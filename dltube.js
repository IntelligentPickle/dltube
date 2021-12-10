import inquirer from "inquirer";
import { execFile } from "child_process"
import { readFile } from 'fs/promises'; // ES :/
import fs from 'fs'

const config = JSON.parse(
  await readFile(
    new URL('./config.json', import.meta.url)
  )
);

if (!fs.existsSync(config.dltube.ytdlpBinary)) {
    console.error(`YT-DLP binary (${config.dltube.ytdlpBinary}) is missing.\nCheck config.json, or run yarn run prepare.`)
    process.exit();
}

if (!fs.existsSync(config.dltube.ffmpegDirectory)) {
    console.error(`Ffmpeg folder (${config.dltube.ffmpegDirectory}) is missing.\nCheck config.json, or run yarn run prepare.`)
    process.exit();
}


async function menu() {

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Select an option.',
                choices: ['Video + Audio', 'Audio', 'Exit'],
                filter(val) {
                return val.toLowerCase();
                },
            },
        ])
        .then((answers) => {
            handleMenuResponse(answers)
        })
        .catch((error) => {
            throw error;
    });
}

async function handleMenuResponse(a) {

    switch (a.choice) {
        case 'video + audio':
            let link = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'ytlink',
                    message: 'Please enter a youtube link.',
                },
            ])
            let e = execFile('./yt-dlp', [ link.ytlink, '-f mp4', `--ffmpeg-location ${config.dltube.ffmpegDirectory}` ], (e) => {console.log(e)})
            e.stdout.pipe(process.stdout)
            e.on('close', function(code) {
                menu();
            });
            break;
        case 'audio':
            let linkA = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'ytlink',
                    message: 'Please enter a youtube link.',
                },
            ])
            let eA = await execFile('./yt-dlp', [ linkA.ytlink, '-x', `--ffmpeg-location ${config.dltube.ffmpegDirectory}`], (e) => {console.log(e)})
            eA.stdout.pipe(process.stdout)
            eA.on('close', function(code) {
                menu();
            });
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('Invalid option.')
            menu();
    }
}


menu()