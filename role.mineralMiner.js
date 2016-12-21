module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let mineral = Game.getObjectById(creep.memory.mineralId);
        let extractor = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_EXTRACTOR
        });
        let container = mineral.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];

        if (creep.pos.isEqualTo(container.pos)) {
            if (_.sum(container.store) < container.storeCapacity) {
                creep.harvest(mineral);
            }
        }
        else {
            creep.moveTo(container);
        }
    }
};