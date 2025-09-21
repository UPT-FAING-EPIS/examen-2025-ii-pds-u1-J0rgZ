using Microsoft.EntityFrameworkCore;
using AuctionApp.Api.Models;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions<AuctionDbContext> options) : base(options) { }
    public DbSet<Auction> Auctions { get; set; }
}