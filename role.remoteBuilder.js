
module.exports = {
    
    /** @param {Creep} creep **/
    run: function (creep) {
        var roleJanitor = require('role.janitor');
        
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit))
        }

        if(creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target != undefined) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                roleJanitor.run(creep);
            }
        } 
        else {
            if (creep.room.name != creep.memory.target) {
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};
