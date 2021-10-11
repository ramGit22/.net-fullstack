using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebApplication2.Helpers
{
    public class CustomJsonWriter: JsonTextWriter
    {
        public CustomJsonWriter(TextWriter writer) : base(writer) { }

        public override void WritePropertyName(string name)
        {
            if (name.StartsWith("@") || name.StartsWith("#"))
            {
                base.WritePropertyName(name.Substring(1));
            }
            else
            {
                base.WritePropertyName(name);
            }
        }
    }
}