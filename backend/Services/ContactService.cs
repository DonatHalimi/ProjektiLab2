using MongoDB.Driver;
using backend.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class ContactService
    {
        private readonly IMongoCollection<Contact> _contactCollection;
        private readonly IMongoDatabase _database;

        public ContactService(IConfiguration configuration)
        {
            var mongoClient = new MongoClient(configuration["MongoDB:ConnectionString"]);
            _database = mongoClient.GetDatabase(configuration["MongoDB:DatabaseName"]);
            // Check if collection exists, if not create it
            var filter = new MongoDB.Bson.BsonDocument("name", configuration["MongoDB:ContactCollectionName"]);
            var collections = _database.ListCollections(new ListCollectionsOptions { Filter = filter });
            
            if (!collections.Any())
            {
                _database.CreateCollection(configuration["MongoDB:ContactCollectionName"]);
            }
            
            _contactCollection = _database.GetCollection<Contact>(configuration["MongoDB:ContactCollectionName"]);

            // Create indexes if needed
            var indexKeysDefinition = Builders<Contact>.IndexKeys.Ascending(contact => contact.CreatedAt);
            var indexOptions = new CreateIndexOptions { Name = "CreatedAt_Index" };
            var indexModel = new CreateIndexModel<Contact>(indexKeysDefinition, indexOptions);
            _contactCollection.Indexes.CreateOne(indexModel);
        }

        public async Task<List<Contact>> GetAsync() =>
            await _contactCollection.Find(_ => true).ToListAsync();

        public async Task<Contact> GetAsync(string id) =>
            await _contactCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Contact contact)
        {
            contact.CreatedAt = DateTime.UtcNow;
            await _contactCollection.InsertOneAsync(contact);
        }

        public async Task RemoveAsync(string id) =>
            await _contactCollection.DeleteOneAsync(x => x.Id == id);

        public async Task RemoveManyAsync(string[] ids)
        {
            var filter = Builders<Contact>.Filter.In(x => x.Id, ids);
            await _contactCollection.DeleteManyAsync(filter);
        }
    }
} 