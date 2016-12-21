
module.exports = function() {
    StructureSpawn.prototype.createCustomCreep =
        function (energy, roleName) {
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.createCreep(body, undefined, { role: roleName, working: false });
        };
    StructureSpawn.prototype.createRemoteBuilder =
        function (energy, target) {
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.createCreep(body, undefined, { role: 'remoteBuilder', working: false, target: target });
        };
    StructureSpawn.prototype.createClaimer =
        function (target) {
            return this.createCreep([CLAIM, MOVE, MOVE], undefined, { role: 'claimer', target: target });
        };
    StructureSpawn.prototype.createMiner =
        function (sourceId) {
            return this.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, { role: 'miner', sourceId: sourceId });
        };
    StructureSpawn.prototype.createMineralMiner =
        function (mineralId) {
            return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, { role: 'mineralMiner', mineralId: mineralId });
        };
    StructureSpawn.prototype.createHauler =
        function (energy) {
            var numberOfParts = Math.floor(energy / 150);
            var body = [];
            for (let i = 0; i < numberOfParts * 2; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
            return this.createCreep(body, undefined, { role: 'hauler', working: false });
        };
    StructureSpawn.prototype.createMineralHauler =
        function (energy, mineralType) {
            var numberOfParts = Math.floor(energy / 150);
            var body = [];
            for (let i = 0; i < numberOfParts * 2; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
            return this.createCreep(body, undefined, { role: 'mineralHauler', mineralType: mineralType, working: false });
        };
    StructureSpawn.prototype.createLongDistanceHarvester =
        function (energy, numberOfWorkParts, home, target) {
            var body = [];
            for (let i = 0; i < numberOfWorkParts; i++) {
                body.push(WORK);
            }

            energy -= 150 * numberOfWorkParts;

            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
                body.push(MOVE);
            }
            return this.createCreep(body, undefined, {
                role: 'longDistanceHarvester',
                home: home,
                target: target,
                working: false
            });
        };
};