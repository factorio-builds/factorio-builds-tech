using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace FactorioTech.Core.Domain
{
    public class BuildTags : IReadOnlySet<string>
    {
        private readonly IReadOnlySet<string> _data;

        private BuildTags(IReadOnlyDictionary<string, IEnumerable<string>> data) =>
            _data = data.SelectMany(kvp => kvp.Value.Select(tag => $"/{kvp.Key}/{tag}")).ToHashSet();

        public static BuildTags Load()
        {
            const string resourceName = "tags.json";
            var assembly = Assembly.GetExecutingAssembly();
            var stream = assembly.GetManifestResourceStream($"{assembly.GetName().Name}.{resourceName}")
                         ?? throw new Exception($"Failed loading tags embedded resource: {resourceName}");
            var json = new StreamReader(stream).ReadToEnd();
            var data = JsonSerializer.Deserialize<IReadOnlyDictionary<string, IEnumerable<string>>>(json)
                       ?? throw new Exception($"Failed to load tags from embedded resource: {resourceName}");
            return new BuildTags(data);
        }

        public int Count => _data.Count;
        public bool Contains(string item)=> _data.Contains(item);
        public bool IsProperSubsetOf(IEnumerable<string> other) => _data.IsProperSubsetOf(other);
        public bool IsProperSupersetOf(IEnumerable<string> other) => _data.IsProperSupersetOf(other);
        public bool IsSubsetOf(IEnumerable<string> other) => _data.IsSubsetOf(other);
        public bool IsSupersetOf(IEnumerable<string> other) => _data.IsSupersetOf(other);
        public bool Overlaps(IEnumerable<string> other) => _data.Overlaps(other);
        public bool SetEquals(IEnumerable<string> other) => _data.SetEquals(other);
        public IEnumerator<string> GetEnumerator() => _data.GetEnumerator();
        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}
