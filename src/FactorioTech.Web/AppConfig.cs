using System;
using System.IO;

namespace FactorioTech.Web
{
    public class AppConfig
    {
        public static readonly Uri FbsrWrapperUri = new Uri("http://localhost:8080");
        public static string WorkingDir = Path.GetTempPath();
    }
}
