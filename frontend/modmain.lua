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

function startBossMusic()
    playingMusic = true

    GLOBAL.TheSim:QueryServer("http://localhost:3883/startBoss", function () end)
    GLOBAL.TheMixer:SetLevel("set_music", 0.2)
end

function stopBossMusic(inst)
    inst:DoTaskInTime(3, function ()
        playingMusic = false

        GLOBAL.TheSim:QueryServer("http://localhost:3883/endBoss", function () end)
        GLOBAL.TheMixer:SetLevel("set_music", 0)
    end)
end

AddPrefabPostInit("world", function (inst)
    GLOBAL.TheSim:QueryServer("http://localhost:3883", function (_, isSuccess)
        if isSuccess then

        end
    end)
end)

AddPlayerPostInit(function (inst)
    inst:ListenForEvent("triggeredevent", function (_, data)
        if not findBoss(data.name) then
            return
        end

        if not playingMusic then
            startBossMusic(inst)
        end

        if stopMusicTask then
            stopMusicTask:Cancel()
        end

        stopMusicTask = inst:DoTaskInTime(2, function ()
            stopBossMusic(inst)
        end)
    end)
end)
