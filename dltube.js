import inquirer from "inquirer";
import { execFile } from "child_process"

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