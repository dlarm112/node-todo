const fs = require('fs')
const yargs = require('yargs')
const chalk = require('chalk');

function loadData() {
    try {
        const buffer = fs.readFileSync('data.json')
        const data = buffer.toString()
        const dataObj = JSON.parse(data)
        return dataObj
    } catch (err) {
        return []
    }
}

function saveData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data))
}

function addTodo(todo, status) {
    const data = loadData()
    const newTodo = {
        todo: todo,
        status: status
    }
    data.push(newTodo)
    saveData(data)
}

yargs.command({
    command: "list",
    describe: "List all todos",
    builder: {
        status: {
            describe: "status of todos",
            default: "all",
            type: "string",
            alias: "s",
        },
    },
    handler: function (arg) {
        console.log(chalk.blue.bold("listing todos"))
        let data = loadData()
        if (arg.status === "all") {
            data = data
        } else if (arg.status === "list complete") {
            data = data.filter(item => item.status === true)
        } else if (arg.status === "list incomplete") {
            data = data.filter(item => item.status === false)
        }
        data.forEach(({
            todo,
            status
        }, idx) => {
            if (status === true) {
                console.log(chalk.green(`
                ID: ${idx} 
                TASK: ${todo} 
                STATUS:  ${status}`))
            } else if (status === false) {
                console.log(chalk.red(`
                ID: ${idx} 
                TASK: ${todo} 
                STATUS: ${status}`))
            }
        })
    },
})

yargs.command({
    command: "delete",
    describe: "deletes single index",
    builder: {
        id: {
            demandOption: true,
            type: "string",
            alias: "i",
        },
    },
    handler: function (arg) {
        let data = loadData()
        if (arg.id === "all") {
            data = []
            saveData(data)
        } else {
            data.splice(arg.id, 1)
            saveData(data)
        }

    },
})

yargs.command({
    command: "add",
    describe: "add new todo",
    builder: {
        todo: {
            describe: "todo content",
            demandOption: true,
            type: "string",
            alias: "t"
        },
        status: {
            describe: "status of todo",
            demandOption: false,
            type: "boolean",
            alias: "s",
            default: false,
        },
    },
    handler: function ({
        todo,
        status
    }) {
        addTodo(todo, status)
        console.log("added todo succesful")
    }
})

yargs.command({
    command: "toggle",
    describe: "completes single index",
    builder: {
        id: {
            demandOption: true,
            type: "string",
            alias: "t",
        },
    },
    handler: function (arg) {
        let data = loadData()
        console.log(data)
        data[arg.id].status = data[arg.id].status != true
        saveData(data)
    }
})







yargs.command({
    command: "delete_all",
    describe: "deletes all todos",
    handler: function () {
        let data = []
        saveData(data)
    }
})



yargs.parse()