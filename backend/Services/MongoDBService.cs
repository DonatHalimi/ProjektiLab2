using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;

public class MongoDBService
{
    private readonly IMongoCollection<FAQ> _faqCollection;

    public MongoDBService(IConfiguration configuration)
    {
        var mongoClient = new MongoClient(configuration["MongoDB:ConnectionString"]);
        var mongoDatabase = mongoClient.GetDatabase(configuration["MongoDB:DatabaseName"]);
        _faqCollection = mongoDatabase.GetCollection<FAQ>(configuration["MongoDB:FAQCollectionName"]);
    }

    public async Task<List<FAQ>> GetAsync() =>
        await _faqCollection.Find(_ => true).ToListAsync();

    public async Task<FAQ> GetAsync(string id) =>
        await _faqCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(FAQ faq)
    {
        try
        {
            // Generate a new ObjectId
            faq.Id = ObjectId.GenerateNewId().ToString();
            
            // Set timestamps
            faq.CreatedAt = DateTime.UtcNow;
            faq.UpdatedAt = DateTime.UtcNow;

            await _faqCollection.InsertOneAsync(faq);
        }
        catch (Exception ex)
        {
            throw new Exception($"Error creating FAQ: {ex.Message}");
        }
    }

    public async Task UpdateAsync(string id, FAQ faq)
    {
        try
        {
            faq.Id = id;
            faq.UpdatedAt = DateTime.UtcNow;
            await _faqCollection.ReplaceOneAsync(x => x.Id == id, faq);
        }
        catch (Exception ex)
        {
            throw new Exception($"Error updating FAQ: {ex.Message}");
        }
    }

    public async Task RemoveAsync(string id)
    {
        try
        {
            await _faqCollection.DeleteOneAsync(x => x.Id == id);
        }
        catch (Exception ex)
        {
            throw new Exception($"Error deleting FAQ: {ex.Message}");
        }
    }
} 