namespace AuctionApp.Api.Models
{
    public class Auction
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsActive { get; set; }
    }
}
