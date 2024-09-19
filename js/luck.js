const LUCK = {
    mult() {
        let x = E(1)
        return x
    },
    pow() {
        let x = E(1)
        return x
    },
    generate() {
        let r = 5

        //r = r.min(player.max_rarity.add(1))

        return r.floor()
    },
}

const RARITY_PREFIX = [
    ["Common","Uncommon","Rare",'Unique',"Epic","Legendary",'Mythic','Divine','Almighty','Phenomenal','Preeminent','Inlimitable','Exotic','Ethereal','Scarce','Superior','Astronia','Affinity','Noviax','Endre','Abyxtic'],
    ['',"Kilo","Mega","Giga",'Tera','Peta','Exa','Zetta','Yotta','Xenna','Weka','Vendeka','Uda','Tradaka','Sorta','Rinta','Quexa','Pepta','Ocha','Nena','Minga','Luma','Kema','Jretta','Iqatta','Huitta','Gatextta','Feqesa','Encsenda','Desyta','Ceanata','Bevvgta','Avta'],
    ['','Meta','Hyper','Ultra','Omni','Mesko','Omega'],
]
const RP_LENS = RARITY_PREFIX.map(x=>x.length)

var show_luck_nav = true

function getRarityName(i) {
    let h = ''

    i = E(i).floor()

    if (i.lt(9e15)) {
        i = i.toNumber()

        let a = Math.floor(i / RP_LENS[0])
    
        if (a>0) h += a < RP_LENS[1] ? RARITY_PREFIX[1][a]+"-" : 'Arch'+format(a,0).sup()+'-'
        h += RARITY_PREFIX[0][i%RP_LENS[0]]
    } else {
        let m = i.layer
        if (m>0) h += (m < RP_LENS[2] ? RARITY_PREFIX[2][m] : 'Lode'+format(m,0).sup()) + (m<9e15?"-":"")

        if (m<9e15) {
            let p = Math.max(i.mag-15.954242509439325), q = Math.floor((p%1)*RP_LENS[0]), a = Math.floor(p)
        
            if (a>0) h += a < RP_LENS[1] ? RARITY_PREFIX[1][a]+"-" : 'Arch'+format(a,0).sup()+'-'
            h += RARITY_PREFIX[0][q%RP_LENS[0]]
        }
    }

    return h+` [${format(i,0)}σ]`
}

function getRarityChance(i) {
    let x = Decimal.pow(tmp.luckBase,i.scale(1000,1.001,1).scale(tmp.raritySS,2,0)).div(tmp.luckMult).root(tmp.luckPow)

    return x.max(1)
}

function roll() {
    let r = LUCK.generate()

    player.max_rarity = player.max_rarity.max(r)

    tmp.el.rolled_div.setHTML(`
    You rolled:<br>
    <h1>${getRarityName(r)}</h1>
    `)

    player.roll_time = 0
}

tmp_update.push(()=>{
    tmp.luckBase = 1.25
    tmp.rollInt = 1-upgradeEffect('rp',1,0)
    tmp.luckMult = LUCK.mult()
    tmp.luckPow = LUCK.pow()
})

el.update.luck = () => {
    let mr = player.max_rarity

    tmp.el.luck_list.setDisplay(show_luck_nav)

    if (show_luck_nav) for (let i = 0; i < 4; i++) {
        let m = mr.add(i)

        let lc = tmp.el['luck_ctn'+i]

        lc.setDisplay(i == 0 || m.lt(9e15))

        if (i > 0 && m.gte(9e15)) continue

        lc.setHTML(
        `
        <h4>${getRarityName(m)}</h4> 1 / ${getRarityChance(m).format()}
        `
        )
    }

    tmp.el.roll_btn.setHTML("Roll ("+format(Math.max(tmp.rollInt-player.roll_time,0),1)+"s)")
}
