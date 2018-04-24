using System;
using System.Collections.Generic;

namespace labCSVparser
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 1)
            {
                Console.WriteLine("\n   Syntax:\n          dotnet labCSVparser.dll [input] [output]");
                return;
            }

            if (!System.IO.File.Exists(args[0]))
            {
                Console.WriteLine("\n   .csv file not found.");
                return;
            }

            if (args.Length < 2 || string.IsNullOrWhiteSpace(args[1]))
            {
                Console.WriteLine("\n   You must specify an output file.");
                return;
            }

            var obj = new Json();

            ReadCsv(args[0], obj);

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);

            System.IO.File.WriteAllText(args[1], json);
        }

        static void ReadCsv(string path, Json json)
        {
            var file = System.IO.File.ReadAllLines(path);
            foreach (var line in file)
            {
                if (line.StartsWith("Sala;Nome;")) continue;
                Console.WriteLine(line);
                var fields = line.Split(';');
                json.Salas[FirebasePushIDGenerator.GeneratePushID()] = new Sala
                {
                    Codigo = fields[0],
                    Nome = fields[1],
                    Curso = fields[6],
                    Equipamento = fields[3]
                };
                
                json.Equipamentos[FirebasePushIDGenerator.GeneratePushID()] = new Equipamento
                {
                    Nome = fields[2],
                    Patrimonio = fields[3],
                    Especificacao = fields[4],
                    Sala = fields[0],
                    Marca = fields[5],
                    Status = fields[7]
                };
            }
        }
    }

    public class Json
    {
        public Dictionary<string, Sala> Salas;
        public Dictionary<string, Equipamento> Equipamentos;

        public Json()
        {
            Salas = new Dictionary<string, Sala>();
            Equipamentos = new Dictionary<string, Equipamento>();
        }
    }

    public class Sala
    {
        public string Codigo;
        public string Nome;
        public string Curso;
        public string Equipamento;
    }

    public class Equipamento
    {
        public string Nome;
        public string Patrimonio;
        public string Especificacao;
        public string Sala;
        public string Marca;
        public string Status;
    }

    public class FirebasePushIDGenerator
    {
        /**
         * Fancy ID generator that creates 20-character string identifiers with the following properties:
         *
         * 1. They're based on timestamp so that they sort *after* any existing ids.
         * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
         * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
         * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
         *    latter ones will sort after the former ones.  We do this by using the previous random bits
         *    but "incrementing" them by 1 (only in the case of a timestamp collision).
         */

        // Modeled after base64 web-safe chars, but ordered by ASCII.
        const string PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

        // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
        private static long lastPushTime = 0;


        // We generate 72-bits of randomness which get turned into 12 characters and appended to the
        // timestamp to prevent collisions with other clients.  We store the last characters we
        // generated because in the event of a collision, we'll use those same characters except
        // "incremented" by one.
        private static char[] lastRandChars = new char[12];

        // Random number generator
        private static Random rng = new Random();

        public static string GeneratePushID()
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            Console.WriteLine("now=" + now);

            var duplicateTime = (now == lastPushTime);
            lastPushTime = now;

            var timeStampChars = new char[8];
            for (var i = 7; i >= 0; i--)
            {
                timeStampChars[i] = PUSH_CHARS[(int)(now % 64)];
                now = now >> 6;
            }

            if (now != 0) throw new Exception("We should have converted the entire timestamp.");

            var id = string.Join(string.Empty, timeStampChars);

            if (!duplicateTime)
            {
                for (var i = 0; i < 12; i++)
                {
                    lastRandChars[i] = (char)rng.Next(0, 63);
                }
            }
            else
            {
                // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
                int i;
                for (i = 11; i >= 0 && lastRandChars[i] == 63; i--)
                {
                    lastRandChars[i] = (char)0;
                }
                lastRandChars[i]++;
            }

            for (var i = 0; i < 12; i++)
            {
                id += PUSH_CHARS[lastRandChars[i]];
            }

            if (id.Length != 20) throw new Exception("Length should be 20.");

            return id;
        }

        public static long ConvertPushID(string id)
        {
            var timestamp = 0L;

            for (var i = 0; i < 8; i++)
            {
                var n = PUSH_CHARS.IndexOf(id[i]);
                timestamp = (timestamp << 6) + n;
            }

            return timestamp;
        }
    }
}
