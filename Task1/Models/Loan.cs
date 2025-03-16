using System;
using System.Collections.Generic;

namespace Task1.Models;

public partial class Loan
{
    public int LoanId { get; set; }

    public string LoanNo { get; set; } = null!;

    public string? Name { get; set; }

    public string? State { get; set; }

    public string? Address { get; set; }
}
