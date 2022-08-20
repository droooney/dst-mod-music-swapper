local bosses = {
    "alterguardian_phase1",
    "alterguardian_phase2",
    "alterguardian_phase3",
    "antlion",
    "beequeen",
    "crabking",
    "dragonfly",
    "eyeofterror",
    "klaus",
    "malbatross",
    "shadowchess",
    "stalker",
    "toadstool",
}

local playingMusic = false
local stopMusicTask

function findBoss(boss)
    for _, b in ipairs(bosses) do
        if b == boss then
            return true
        end
    end

    return false
end

function startBossMusic(bossName)
    playingMusic = true

    GLOBAL.TheSim:QueryServer("http://localhost:3883/api/startBoss?bossName=" .. bossName, function () end)
    GLOBAL.TheMixer:SetLevel("set_music", 0.2)
end

function stopBossMusic(bossName)
    playingMusic = false

    GLOBAL.TheSim:QueryServer("http://localhost:3883/api/endBoss?bossName=" .. bossName, function () end)
    GLOBAL.TheMixer:SetLevel("set_music", 0)
end

AddPlayerPostInit(function (inst)
    inst:ListenForEvent("triggeredevent", function (_, data)
        if not findBoss(data.name) then
            return
        end

        if not playingMusic then
            startBossMusic(data.name)
        end

        if stopMusicTask then
            stopMusicTask:Cancel()
        end

        stopMusicTask = inst:DoTaskInTime(15, function ()
            stopBossMusic(data.name)
        end)
    end)
end)
