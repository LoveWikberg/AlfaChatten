using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AlfaChatten.ExtensionMethods
{
    public static class CustomStringExtension
    {
        public static string ReplaceSwedishCharactersAndRemoveWhiteSpaces(this string value)
        {
            value = value.Replace('Å', 'A');
            value = value.Replace('å', 'a');
            value = value.Replace('ä', 'A');
            value = value.Replace('Ä', 'a');
            value = value.Replace('ö', 'o');
            value = value.Replace('Ö', 'O');
            value = value.Replace(" ", string.Empty);

            return value;
        }
    }
}
