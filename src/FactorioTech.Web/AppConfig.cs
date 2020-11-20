using System;
using System.IO;

namespace FactorioTech.Web
{
    public class AppConfig
    {
        public static readonly Uri FbsrWrapperUri = new("http://localhost:8080");
        public static string WorkingDir = Path.GetTempPath();
        public static string FactorioDir = "D:\\Downloads\\Factorio_x64_1.0.0\\Factorio_1.0.0";
    }
}
