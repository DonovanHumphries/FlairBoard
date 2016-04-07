var defer = require("node-promise").defer;

//TODO Enity is .Net rename to Document

module.exports = function(Entity){

    var createEntity = function(entity)
    {
        var deferred = defer();
        //This is auto generated 
        delete entity["_id"];
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
    var getEntity = function(search)
    {
        var deferred = defer();
        Entity.findOne(search,
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

    var deleteEntities = function(search)
    {
        var deferred = defer();
        Entity.remove(search,
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
        GetEntity:getEntity,
        FindEntities:findEntities,
        DeleteEntity:deleteEntity,
        DeleteEntities:deleteEntities,
        UpdateEntity:updateEntity
    }
};