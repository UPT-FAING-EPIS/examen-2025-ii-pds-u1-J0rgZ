using AuctionApp.Api.Data;
using AuctionApp.Api.Hubs;
using AuctionApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace AuctionApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionsController : ControllerBase
    {
        private readonly IMongoCollection<Auction> _auctions;
        private readonly IHubContext<AuctionHub> _hubContext;

        // Inyectamos la base de datos de MongoDB
        public AuctionsController(IMongoDatabase database, IHubContext<AuctionHub> hubContext)
        {
            _auctions = database.GetCollection<Auction>("Auctions");
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Auction>>> GetAuctions()
        {
            // Si no hay subastas, creamos una para la demo
            if (await _auctions.CountDocumentsAsync(FilterDefinition<Auction>.Empty) == 0)
            {
                await _auctions.InsertOneAsync(new Auction { ItemName = "Ejemplo desde MongoDB", CurrentPrice = 150, EndTime = DateTime.UtcNow.AddHours(1), IsActive = true });
            }
            return await _auctions.Find(Builders<Auction>.Filter.Empty).ToListAsync();
        }

        [Authorize]
        [HttpPost("{id}/bids")]
        public async Task<IActionResult> PlaceBid(string id, [FromBody] decimal amount)
        {
            var filter = Builders<Auction>.Filter.Eq(a => a.Id, id);
            var auction = await _auctions.Find(filter).FirstOrDefaultAsync();

            if (auction == null) return NotFound();
            if (amount <= auction.CurrentPrice) return BadRequest("La puja debe ser mayor.");

            var update = Builders<Auction>.Update.Set(a => a.CurrentPrice, amount);
            await _auctions.UpdateOneAsync(filter, update);

            await _hubContext.Clients.All.SendAsync("ReceiveBidUpdate", id, amount);
            return Ok();
        }
    }
}
