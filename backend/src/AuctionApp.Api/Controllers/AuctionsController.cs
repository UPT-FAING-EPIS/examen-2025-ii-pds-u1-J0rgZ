using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using AuctionApp.Api.Models;
using AuctionApp.Api.Data;
using AuctionApp.Api.Hubs;

namespace AuctionApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            return await _context.Auctions.ToListAsync();
        }

        [HttpPost("{id}/bids")]
        public async Task<IActionResult> PlaceBid(int id, [FromBody] decimal amount)
        {
            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null) return NotFound();
            if (amount <= auction.CurrentPrice) return BadRequest("Bid must be higher than current price.");

            auction.CurrentPrice = amount;
            await _context.SaveChangesAsync();

            // Notificar a todos los clientes via WebSocket
            await _hubContext.Clients.All.SendAsync("ReceiveBidUpdate", id, amount);

            return Ok(auction);
        }
    }
}

