using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public sealed class Blueprint
    {
        [Key]
        public Guid Id { get; init; }

        public Guid OwnerId { get; init; }

        //public string Encoded { get; }
        //public FactorioApi.Blueprint Payload { get; }
    }
}
