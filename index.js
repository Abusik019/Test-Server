// const os = require("os");
// const moment = require("moment");
// const { parse } = require("node-html-parser");
// const chalk = require("chalk");

// // os.platform()
// // os.arch()
// // os.cpus()
// // os.endianness()
// // os.type()
// // os.userInfo()
// // os.totalmem()
// // os.freemem()
// // os.release()
// // os.networkInterfaces()
// // os.loadavg()
// // os.uptime()
// // os.hostname()

// // console.log(moment)

// // Format
// // console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
// // console.log(moment().format('dddd'))
// // console.log(moment().format('MMM Do YY'))
// // console.log(moment().format('[Date]: MMMM Do YYYY[\nTime]: h:mm:ss a'))

// // // Relative time
// // console.log(moment('20240303', 'YYYYMMDD').fromNow())
// // console.log(moment().startOf('day').fromNow())
// // console.log(moment().startOf('month').fromNow())
// // console.log(moment().startOf('year').fromNow())
// // console.log(moment().startOf('hour').fromNow())

// // // Calendar Time
// // console.log(moment().subtract(10, 'days').calendar())
// // console.log(moment().subtract(1, 'days').calendar())
// // console.log(moment().subtract(7, 'days').calendar())
// // console.log(moment().calendar())
// // console.log(moment().add(1, 'days').calendar())
// // console.log(moment().add(4, 'days').calendar())
// // console.log(moment().add(10, 'days').calendar())

// // // Locale
// // console.log(moment.locale())
// // console.log(moment().format('LT'))
// // console.log(moment().format('LTS'))
// // console.log(moment().format('L'))
// // console.log(moment().format('LL'))
// // console.log(moment().format('ll'))
// // console.log(moment().format('LLL'))
// // console.log(moment().format('lll'))
// // console.log(moment().format('LLLL'))
// // console.log(moment().format('llll'))

// // const root = parse('<ul id="list"><li>Hello World<span></li></ul>');

// // console.log(root.firstChild.range)
// // console.log(root.firstChild.innerText)
// // console.log(root.firstChild.rawText)
// // console.log(root.firstChild.childNodes)
// // console.log(root.firstChild.tagName)
// // console.log(root.querySelector('#list'))

// // Создайте программу на Node.js для мониторинга основных характеристик операционной системы с использованием модуля os.

// // Используя os, выведите следующую информацию:
// // Имя операционной системы
// // Архитектура процессора
// // Версию операционной системы
// // Сведения о памяти (всего и доступно в ГБ)
// // Используйте модуль moment для форматирования текущей даты и времени.

// // Установите интервал проверки системных ресурсов и записи событий. Например, каждые 5 секунд.

// // Разработайте функцию, которая будет выводить текущую дату и время в удобочитаемом формате с использованием moment.
// // Создайте журнал событий для отслеживания изменений в ресурсах системы. Например, при превышении определенного порога использования памяти или процессора, записывайте соответствующую информацию в журнал событий.

// // const CONVERT_TO_GB = (number) =>{
// //     return +(number / (1024 * 1024 * 1024)).toFixed(1)
// // }

// // const GET_CURRENT_TIME_CALENDAR = () => {
// //     return moment().format("DD MMM, YYYY hh:mm:ss")
// // }

// // const MAX_USED_MEM = 10;

// // function conclusionInfo(){
// //     return {
// //         osName : `${os.type()} - ${os.release()}`,
// //         cpu: {
// //             model: os.cpus()[0].model,
// //             cores: os.cpus().length,
// //             threads: os.cpus().length,
// //         },
// //         RAM: {
// //             total: CONVERT_TO_GB(os.totalmem()),
// //             used: CONVERT_TO_GB(os.totalmem() - os.freemem()),
// //             free: CONVERT_TO_GB(os.freemem())
// //         },
// //     }
// // }

// // const notes = [];

// // const interval = setInterval(() => {
// //     const   usedRam = conclusionInfo().RAM.used,
// //             usedThreads = conclusionInfo().cpu.threads;

// //     if(usedRam >= MAX_USED_MEM){
// //         notes.push(conclusionInfo());
// //         console.log(chalk.bgRedBright('\nLimit has been reached'));
// //     }else{
// //         console.log(chalk.bgGreenBright('\nLimit has not been reached'));
// //     }

// //     console.log(`Common info: ${chalk.cyan(JSON.stringify(conclusionInfo()))}\nDate and time of note: ${chalk.magentaBright(GET_CURRENT_TIME_CALENDAR())}\n`)
// // }, 5000)

// // console.log(chalk.red('Error'))
// // console.log(chalk.underline.red('Error'))
// // console.log(chalk.underline.bold.red('Error'))
// // console.log(chalk.underline.bold.red.italic('Error'))
// // console.log(chalk.underline.bold.yellow.bgGrey('Error'))

// // npm WARN saveError ENOENT: no such file or dir

// // console.log(`${chalk.bgBlack.bold('npm')} ${chalk.bgYellowBright.bold('WARN')} ${chalk.magenta('saveError')} ENOENT: no such file or dir`)
// // chalk.bold.blue.underline('Text')

// // console.log(chalk.red('Red'))
// // console.log(chalk.red.green('Red'))

// // Modifiers

// // reset
// // bold
// // italic
// // underline
// // inverse
// // hidden
// // visible
// // dim

// // Color

// // blackBright
// // red
// // green
// // yellow
// // blue
// // magenta
// // white
// // rgb(15, 100, 204)
// // hex('#481211')

// // bgColor
// // bg + color.uppercase()
// // console.log(chalk.bgRed('text'))

// // console.log(`${chalk.bgBlack.bold('npm')} ${chalk.bgYellowBright.bold('WARN')} ${chalk.magenta('saveError')} ENOENT: no such file or dir`)

// // function npmMessage(name, messageType, messageDesc, message) {
// //     const npmStyle = chalk.bgBlack.bold,
// //         typeStyle =
// //             messageType === "ERR"
// //                 ? chalk.bgRedBright.bold
// //                 : messageType === "WARN"
// //                 ? chalk.bgYellowBright.bold
// //                 : chalk.bgGreenBright.bold,
// //         descStyle = chalk.magenta;

// //     return `${npmStyle(name)} ${typeStyle(messageType)} ${descStyle(messageDesc)} ${message}`

// // }


// // console.log(npmMessage('npm', 'WARN', 'saveError', 'ENOENT: no such file or dir'))
// // console.log(npmMessage('npm', 'ERR', 'saveError', 'ENOENT: no such file or dir'))
// // console.log(npmMessage('npm', 'SUCC', 'saveError', 'ENOENT: no such file or dir'))


// // const NODE_MESSAGE_STYLE = chalk.bgCyanBright.yellow;

// // console.log(NODE_MESSAGE_STYLE('Text'))
// // console.log(NODE_MESSAGE_STYLE('Text1'))
// // console.log(NODE_MESSAGE_STYLE('Text12'))
// // console.log(NODE_MESSAGE_STYLE('Text123'))


// // ДЗ повторить модуль chalk, os, parser, moment, улучшить выводы за счет даты и цвета и формирования, 


// // require('dotenv').config()
// // const winston = require('winston');
// // const {combine, json, timestamp, printf, label, colorize, align, prettyPrint} = winston.format;


// // const myFormat = printf((object) => {
// //     return `${object.timestamp} [${object.label}] ${object.level}: ${object.message}`
// // })


// // const logger = winston.createLogger({
// //     level: 'info',
// //     format: combine(
// //         colorize({all: true}),
// //         label({label: 'My info'}),
// //         timestamp({
// //             format: 'YYYY-MM-DD hh:mm:ss.SSS A'
// //         }),
// //         align(),
// //         json(),
// //         myFormat
// //     ),
// //     transports: [
// //         new winston.transports.Console(),
// //         new winston.transports.File({
// //             filename: 'combined.log'
// //         }),
// //         new winston.transports.File({
// //             filename: 'info.log',
// //             level: 'info'
// //         }),
// //     ],
// // })


// // if(process.env.NODE_MODE !== 'production'){
// //     logger.log('info', 'Сервер успешно запущен на порту 3000.')
// // }


// // logger.log('error', 'Не удалось выполнить операцию.')

// // logger.log('warn', 'Используется устаревший метод, пожалуйста, обновите ваш код.')


// // Необходимо настроить вывод логов в консоли и файлы warn и error. Выводить с выравниванием, цветом. Лог содержит время, уровень и сообщение,
// // Формат:        [time] level: message

// const winston = require('winston');
// const { log } = require("console");

// // const { combine, timestamp, colorize, align, printf, json } = winston.format;

// // const formatLog = printf((object) => {
// //     return `${[object.timestamp]} ${object.level}: ${object.message}`;
// // })

// // const logger = winston.createLogger({
// //     level: 'info',
// //     format: combine(
// //         colorize({all: true}),
// //         timestamp({
// //             format: "DD-MM-YYYY hh:mm A"
// //         }),
// //         align(),
// //         json(),
// //         formatLog
// //     ),
// //     transports: [
// //         new winston.transports.Console(),
// //         new winston.transports.File({
// //             filename: 'error.log',
// //             level: 'error'
// //         }),
// //         new winston.transports.File({
// //             filename: 'warn.log',
// //             level: 'warn'
// //         }),
// //     ],
// // })

// // logger.log("warn", "Warn message");
// // logger.log("error", "Error message");

// const { combine, printf, colorize, align, timestamp, json } = winston.format;

// const loggerInfo = printf((object) => {
//     return `${object.level}: ${object.message} | ${[object.timestamp]}`
// }) 

// const logger = winston.createLogger({
//     level: "info",
//     format: combine(
//         timestamp({
//             format: 'YYYY-MM-DD'
//         }),
//         colorize({all: true}),
//         align(),
//         json(),
//         loggerInfo
//     ),
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({
//             filename: 'error.log',
//             level: 'error'
//         }),
//         new winston.transports.File({
//             filename: 'warn.log',
//             level: 'warn'
//         }),
//         new winston.transports.File({
//             filename: 'info.log'
//         }),
//     ]
// })

// if(process.env.NODE_MODE !== 'development'){
//     logger.log('info', 'Programm sucess download');
//     logger.log('warn', 'Warn! Data is not valid');
//     logger.log('error', 'The operation failed due to invalid parameters.');
// }


const EventEmitter = require('events')

class Lamp extends EventEmitter{
    constructor(){
        super();
        this.isTurnedOn = false; 
    }

    turnOn(){
        if(!this.isTurnedOn){
            this.isTurnedOn = true;
            this.emit('turnOn', 'The lamp is now turned on');
        }
    }

    
    turnOff(){
        if(this.isTurnedOn){
            this.isTurnedOn = false;
            this.emit('turnOff', 'The lamp is now turned off');
        }
    }
}

const lamp = new Lamp();

lamp.on('turnOn', (e) => {
    console.log(e)
})

lamp.on('turnOff', (e) => {
    console.log(e)
})


lamp.turnOn()
lamp.turnOff()
lamp.turnOn()
