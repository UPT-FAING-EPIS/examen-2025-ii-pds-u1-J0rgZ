using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using AuctionApp.Api.Models;
using AuctionApp.Api.Data;
using AuctionApp.Api.Hubs;

namespace AuctionApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionsController : ControllerBase
    {
        private readonly AuctionDbContext _context;
        private readonly IHubContext<AuctionHub> _hubContext;

        public AuctionsController(AuctionDbContext context, IHubContext<AuctionHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Auction>>> GetAuctions()
        {
            // Para demo, si no hay subastas, creamos una.
            if (!_context.Auctions.Any())
            {
                _context.Auctions.Add(new Auction { ItemName = "Ejemplo de Subasta", CurrentPrice = 100, EndTime = DateTime.UtcNow.AddHours(1), IsActive = true });
                await _context.SaveChangesAsync();
            }
            return await _context.Auctions.ToListAsync();
        }

        [HttpPost("{id}/bids")]
        public async Task<IActionResult> PlaceBid(int id, [FromBody] decimal amount)
        {
            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null) return NotFound();
            if (amount <= auction.CurrentPrice) return BadRequest("La puja debe ser mayor que el precio actual.");

            auction.CurrentPrice = amount;
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveBidUpdate", id, amount);
            return Ok(auction);
        }
    }
}
