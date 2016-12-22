require('prototype.creep')();
module.exports = function() {
    StructureSpawn.prototype.createBalancedCreep =
        function (energy, roleName, home, target) {
            if (home == undefined) {
                home = this.room.name;
            }
            if (target == undefined) {
                target = false;
            }
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
            return this.createCreep(body, undefined, {
                home: home,
                target: target,
                role: roleName,
                working: false
            });
        };
    StructureSpawn.prototype.createHarvester =
        function(energy, home, target){
            if (home == undefined) { home = this.room.name; }
            if (target == undefined) { target = false; }
            this.createBalancedCreep(energy, Creep.Role.Harvester, home, target);
        };
    StructureSpawn.prototype.createUpgrader =
        function(energy, home, target){
            if (home == undefined) {home = this.room.name;}
            if (target == undefined) {target = false; }
            this.createBalancedCreep(energy, Creep.Role.Upgrader, home, target);
        };
    StructureSpawn.prototype.createBuilder =
        function(energy, home, target){
            if (home == undefined) {home = this.room.name;}
            if (target == undefined) {target = false; }
            this.createBalancedCreep(energy, Creep.Role.Builder, home, target);
        };
    StructureSpawn.prototype.createJanitor =
        function(energy, home, target){
            if (home == undefined) {home = this.room.name;}
            if (target == undefined) {target = false; }
            this.createBalancedCreep(energy, Creep.Role.Janitor, home, target);
        };
    StructureSpawn.prototype.createWallBuilder =
        function(energy, home, target){
            if (home == undefined) {home = this.room.name;}
            if (target == undefined) {target = false; }
            this.createBalancedCreep(energy, Creep.Role.Wall_Builder, home, target);
        };
    StructureSpawn.prototype.createClaimer =
        function (home, target) {
            return this.createCreep([CLAIM, MOVE, MOVE], undefined, {
                home: home,
                target: target,
                role: Creep.Role.Claimer
            });
        };
    StructureSpawn.prototype.createMiner =
        function (home, target, type) {
            if (type == Creep.Role.Energy_Miner || type == Creep.Role.Mineral_Miner) {
                return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, {
                    home: home,
                    target: target,
                    role: type,
                    working: false
                });
            }
            else {
                console.log('Error attempting to create Miner: Wrong Type Selected');
            }
        };
    StructureSpawn.prototype.createHauler =
        function (home, target, type) {
            if (type == Creep.Role.Energy_Hauler || type == Creep.Role.Mineral_Hauler) {
                return this.createCreep([CARRY, CARRY, MOVE], undefined, {
                    home: home,
                    target: target,
                    role: type,
                    working: false
                });
            }
            else {
                console.log('Error attempting to create Hauler: Wrong Type Selected');
            }
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
                role: Creep.Role.Long_Distance_Harvester,
                home: home,
                target: target,
                working: false
            });
        };
    StructureSpawn.prototype.createDefender =
        function(home, target){
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK], undefined, {
                home: home,
                target: target,
                role: Creep.Role.Defender
            });
        };
    StructureSpawn.prototype.createArcher =
        function(home, target){
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], undefined, {
                home: home,
                target: target,
                role: Creep.Role.Archer
            });
        };
    StructureSpawn.prototype.createHealer =
        function(home, target){
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,HEAL,HEAL,HEAL], undefined, {
                home: home,
                target: target,
                role: Creep.Role.Healer
            });
        };
    StructureSpawn.prototype.createSoldier =
        function(home, target){
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK,ATTACK], undefined, {
                home: home,
                target: target,
                role: Creep.Role.Soldier
            });
        };
};