namespace CompoundResearchAPI.Helpers
{
    public static class VectorMathHelper
    {
        public static double CosineSimilarity(float[] a, float[] b)
        {
            if (a.Length != b.Length || a.Length == 0) return 0;

            double dot = 0, magA = 0, magB = 0;
            for (int i = 0; i < a.Length; i++)
            {
                dot += a[i] * b[i];
                magA += a[i] * a[i];
                magB += b[i] * b[i];
            }
            if (magA == 0 || magB == 0) return 0;
            return dot / (Math.Sqrt(magA) * Math.Sqrt(magB));
        }

        public static string ToStorageString(float[] vector) => string.Join(",", vector);

        public static float[] FromStorageString(string stored) =>
            string.IsNullOrWhiteSpace(stored)
                ? Array.Empty<float>()
                : stored.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(float.Parse)
                        .ToArray();
    }
}
