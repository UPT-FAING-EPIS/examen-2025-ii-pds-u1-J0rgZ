using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.AspNetCore.SignalR;
using AuctionApp.Api.Controllers;
using AuctionApp.Api.Data;
using AuctionApp.Api.Models;
using AuctionApp.Api.Hubs;
using System.Threading.Tasks;

public class AuctionsControllerTests
{
    [Fact]
    public async Task PlaceBid_WithValidAmount_ReturnsOk()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AuctionDbContext>()
            .UseInMemoryDatabase(databaseName: "AuctionTestDb")
            .Options;

        using (var context = new AuctionDbContext(options))
        {
            context.Auctions.Add(new Auction { Id = 1, ItemName = "Test Item", CurrentPrice = 100 });
            context.SaveChanges();
        }

        using (var context = new AuctionDbContext(options))
        {
            var hubContextMock = new Mock<IHubContext<AuctionHub>>();
            var clientsMock = new Mock<IClientProxy>();
            var allClientsMock = new Mock<IHubClients>();
            allClientsMock.Setup(c => c.All).Returns(clientsMock.Object);
            hubContextMock.Setup(h => h.Clients).Returns(allClientsMock.Object);

            var controller = new AuctionsController(context, hubContextMock.Object);

            // Act
            var result = await controller.PlaceBid(1, 150);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}