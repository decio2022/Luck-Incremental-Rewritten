var player = {}, date = Date.now(), diff = 0;

function loop() {
    diff = Date.now() - date
    updateTemp()
    updateHTML()
    calc(diff/1000);
    date = Date.now();
}

const MAIN = {
    prestige: {
        gain() {
            let r = player.max_rarity.sub(15)
            if (r.lt(0)) return E(0)
            let x = Decimal.pow(1.1,r).mul(r.add(1))

            x = x.mul(upgradeEffect('tp',1)).mul(upgradeEffect('rp',1))

            return x
        },
        reset() {
            if (player.max_rarity.gte(15)) {
                player.pp = player.pp.add(tmp.ppGain)
                player.pTimes++

                this.doReset()
            }
        },
        doReset() {
            player.max_rarity = E(0)
            player.roll_time = 0
        },
    },
    trans: {
        gain() {
            let r = player.max_rarity.sub(100)
            if (r.lt(0)) return E(0)
            r = r.add(1).root(2)
            let x = Decimal.pow(1.1,r).mul(r.add(1)).mul(player.pp.div(1e8).max(1).root(2))
            
            x = x.mul(upgradeEffect('rp',2))

            return x
        },
        reset() {
            if (player.max_rarity.gte(100)) {
                player.tp = player.tp.add(tmp.tpGain)
                player.tTimes++

                this.doReset()
            }
        },
        doReset() {
            player.pp = E(0)
            resetUpgrades('pp')

            MAIN.prestige.doReset()
        },
    },
    rein: {
        gain() {
            let r = player.max_rarity.sub(300)
            if (r.lt(0)) return E(0)
            r = r.add(1).root(2)
            let x = Decimal.pow(1.1,r).mul(r.add(1)).mul(player.tp.div(1e9).max(1).root(3))

            return x
        },
        reset() {
            if (player.max_rarity.gte(300)) {
                player.rp = player.rp.add(tmp.rpGain)
                player.rTimes++

                this.doReset()
            }
        },
        doReset() {
            player.tp = E(0)
            resetUpgrades('tp')

            MAIN.trans.doReset()
        },
    },
}

el.update.main = ()=>{
    tmp.el.pres_btn.setClasses({locked: tmp.ppGain.lt(1), pres_btn: true})

    tmp.el.pres_btn.setHTML(`
    (Require ${getRarityName(15).bold()})<br>
    Prestige for ${tmp.ppGain.format(0).bold()} Prestige Points
    `)

    tmp.el.tran_btn.setDisplay(player.pTimes>0)
    tmp.el.tran_btn.setClasses({locked: tmp.tpGain.lt(1), pres_btn: true})

    tmp.el.tran_btn.setHTML(`
    (Require ${getRarityName(100).bold()})<br>
    Transcend for ${tmp.tpGain.format(0).bold()} Trancension Points
    `)

    tmp.el.rein_btn.setDisplay(player.tTimes>0)
    tmp.el.rein_btn.setClasses({locked: tmp.rpGain.lt(1), pres_btn: true})

    tmp.el.rein_btn.setHTML(`
    (Require ${getRarityName(300).bold()})<br>
    Reincarnate for ${tmp.rpGain.format(0).bold()} Reincarnation Points
    `)

    // Luck Multiplier

    tmp.el.luck_mult.setHTML("Your luck multiplier: "+formatMult(tmp.luckMult))
}

tmp_update.push(()=>{
    tmp.ppGain = MAIN.prestige.gain()
    tmp.tpGain = MAIN.trans.gain()
    tmp.rpGain = MAIN.rein.gain()
})