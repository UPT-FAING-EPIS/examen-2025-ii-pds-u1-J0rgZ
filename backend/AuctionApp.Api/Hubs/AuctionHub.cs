using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace AuctionApp.Api.Hubs
{
    public class AuctionHub : Hub
    {
        public async Task BroadcastBid(int auctionId, decimal newPrice)
        {
            await Clients.All.SendAsync("ReceiveBidUpdate", auctionId, newPrice);
        }
    }
}
