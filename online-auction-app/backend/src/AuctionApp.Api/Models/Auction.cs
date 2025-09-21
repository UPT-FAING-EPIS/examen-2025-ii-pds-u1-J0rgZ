public class Auction
{
    public int Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public decimal CurrentPrice { get; set; }
    public DateTime EndTime { get; set; }
}