let SetPage = (() => { 
    let querySelectors = {}
    let start = false

    let setDom = () => {
        querySelectors = {
            grid_div: document.querySelector(".grid"),
            reset_btn: document.querySelector("#reset"),
            start_btn: document.querySelector("#start"),
            pname_input: document.querySelectorAll("input"),
            alert_div: document.querySelector("#alert")
        }
    }

    setDom()

    querySelectors.reset_btn.addEventListener("click", (e) => {
        if (start) {
            SetGrid.destroyGrid()
            SetGrid.render()
        }
    })
    
    let alertFunc = (type, duration=2000, name=null) => {
        querySelectors.alert_div.classList.toggle(type)
        if (type == "error") {
            querySelectors.alert_div.innerHTML = `<h4>Enter Player Names!!</h4>`
        } else {
            querySelectors.alert_div.innerHTML = `<h4>Player ${name} won!!!</h4>`
        }
        
        setTimeout(() => {
            querySelectors.alert_div.classList.toggle(type)
            querySelectors.alert_div.innerHTML = ``
        }, duration)
    }

    querySelectors.start_btn.addEventListener("click", (e) => {
        let p = []
        querySelectors.pname_input.forEach((name, index) => {
            p.push(name.value)
        })
        if (p[0] == "" || p[1] == "") {
            alertFunc("error")
            // alert("Enter Player Names!!")
        }
        else {
            GameController.initializePlayer(p[0], p[1])
            SetGrid.destroyGrid()
            SetGrid.render()
            start = true
        } 
    })

    return {
        getDom: () => querySelectors,
        alertFunc,
    }
})();

let SetGrid = (() => {
    let grid_array = []
    let grid_div = SetPage.getDom().grid_div

    let render = () => {
        grid_array = ["", "", "", "", "", "", "", "", ""]
        grid_array.forEach((grid_cell, index) => {
            grid_div.innerHTML += `<div id="cell-${index + 1}" class="grid_cell">${grid_cell}</div>`
        })

        addEvents()
    }

    let addEvents = () => {
        let grid_cells_div = document.querySelectorAll(".grid_cell")
        grid_cells_div.forEach((grid_cell, index) => {
            grid_cell.addEventListener("mouseenter", GameController.hoverMark)
            grid_cell.addEventListener("mouseleave", GameController.hoverOut)
            grid_cell.addEventListener("click", GameController.handleClick)
        })
    }

    let setGridArray = (id, mark) => {
        grid_array[id-1] = mark
    }

    let destroyGrid = () => {
        grid_div.innerHTML = ""
    }

    return {
        render,
        getGridArray: () => grid_array,
        setGridArray,
        destroyGrid,
    }
})();

let Player = (name, mark) => {
    return {
        name, mark
    }
}

let GameController = (() => {
    let players = []
    let winState = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    let initializePlayer = (p1name, p2name) => {
        players = [Player(p1name, "X"), Player(p2name, "O")]
    }
    let playerChance = 0

    let checkEmptyCell = (id) => {
        let grid_array = SetGrid.getGridArray()

        return grid_array[id-1] === ""
    }

    let getIdFromTargetEvent = (e) => {
        return parseInt(e.target.id.split("-")[1])
    }

    let hoverMark = (e) => {
        if (checkEmptyCell(getIdFromTargetEvent(e))) {
            e.target.innerText = players[playerChance].mark
        }
        
    }

    let hoverOut = (e) => {
        if (checkEmptyCell(getIdFromTargetEvent(e))) {
            e.target.innerText = ""
        }
    }

    let handleClick = (e) => {
        let grid_id = getIdFromTargetEvent(e)
        if (checkEmptyCell(getIdFromTargetEvent(e))) {
            e.target.innerText = players[playerChance].mark
            SetGrid.setGridArray(grid_id, players[playerChance].mark)
            playerChance = playerChance == 0 ? 1 : 0
        }
        checkOver()
    }

    let winAlert = (player_name) => {

    }

    let checkOver = () => {
        let grid_array = SetGrid.getGridArray()
        winState.forEach((winpos, index) => {
            const [a, b, c] = winpos
            if (grid_array[a] != "" && grid_array[a] === grid_array[b] && grid_array[b] === grid_array[c]) {
                playerChance = playerChance == 0 ? 1 : 0
                // players[playerChance].name
                SetPage.alertFunc("win", 3000, players[playerChance].name)
                SetGrid.destroyGrid()
                SetGrid.render()
                playerChance = 0
            }
        })
    }

    return {
        playerChance,
        getPlayer: () => players,
        hoverMark,
        handleClick,
        hoverOut,
        initializePlayer,
    }
})();

