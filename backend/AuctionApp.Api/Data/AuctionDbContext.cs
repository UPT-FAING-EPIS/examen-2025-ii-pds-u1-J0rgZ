using AuctionApp.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace AuctionApp.Api.Data
{
    public class AuctionDbContext : DbContext
    {
        // El constructor debe tomar DbContextOptions y pasárselo al constructor base
        public AuctionDbContext(DbContextOptions<AuctionDbContext> options) : base(options)
        {

        }

        public DbSet<Auction> Auctions { get; set; } = null!;
    }

}
