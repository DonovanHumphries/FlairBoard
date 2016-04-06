var defer = require("node-promise").defer;


module.exports = function(Entity){

    var createEntity = function(entity)
    {
        var deferred = defer();

        var newEntity = new Entity(entity);

        newEntity.save(function(err) {
               if (err){
                console.log('Error in Saving newEntity: '+err);
                throw(err);
            }
            deferred.resolve(newEntity._id);
        });

        return deferred.promise;
    };
    var findEntities = function(search)
    {
        var deferred = defer();
        Entity.find(search,
            function(err, results) {
                if (err) {
                    console.log('Error in find: '+err);
                    throw err;
                }
                deferred.resolve(results);
            }
        );
        return deferred.promise;
    };
    var deleteEntity = function(entityId)
    {
        var deferred = defer();
        Entity.remove({ _id :  entityId },
            function(err) {
                if (err) {
                    console.log('Error in delete: '+err);
                    throw err;
                }
                deferred.resolve({success:true});
            }
        );
        return deferred.promise;
    };

    var updateEntity = function(entity)
    {
        var deferred = defer();
        Entity.findOneAndUpdate({ '_id' :  entity._id },entity,{new: true},
            function(err, updatedEntity) {
                if (err) {
                    console.log('Error in update: '+err);
                    throw err;
                }
                deferred.resolve({success:true});
            }
        );
        return deferred.promise;
    };
    
    return {
        CreateEntity:createEntity,
        FindEntities:findEntities,
        DeleteEntity:deleteEntity,
        UpdateEntity:updateEntity
    }
};