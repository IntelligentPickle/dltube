import inquirer from "inquirer";
import { execFile } from "child_process"
import { readFile } from 'fs/promises'; // ES :/

const config = JSON.parse(
  await readFile(
    new URL('./config.json', import.meta.url)
  )
);

switch (config.dltube.ytdlpBinary) {
    case 'yt-dlp':
        // Linux binary
        console.log(`YT-DLP binary is a linux binary!`)
        break;
    case 'yt-dlp.exe':
        // Windows x64 binary
        console.log(`YT-DLP binary is a Win x64 binary!`)
        break;
    case 'yt-dlp_x86.exe':
        // Windows x86 binary
        console.log(`YT-DLP binary is a Win x86 binary!`)
        break;
    default:
        console.log(`YT-DLP binary "${config.dltube.ytdlpBinary}" is invalid; check config.json.`)
        process.exit()
        break;
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
            let e = execFile('./yt-dlp', [ link.ytlink, '-f mp4' ], (e) => {console.log(e)})
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
            let eA = await execFile('./yt-dlp', [ linkA.ytlink, '-x'], (e) => {console.log(e)})
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