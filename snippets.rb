#!/usr/bin/env ruby
# build snippets file 
# 
require 'json'
snippets = {}
data = JSON.parse(File.read('scrape.json'))
data.each do |engine, db| 
  db['code'].each do |snippet| 
    snippet['ids'].each_with_index do |id, id_index|
      code = snippet[id]
      if code.nil?
        puts "not found: #{id} in #{snippet.keys}"
        next
      end
      code['language'].each_with_index do |lang, lang_index|
        snippets[lang] ||= {}
        title = snippet['title'][id_index]
        shorttitle = title.downcase.gsub(/\(.*$/, '')
        name = engine + ": " + title
        content = snippet[id]['content']
        raise 'empty content' unless content
        body = content[lang_index]
        body.gsub!(/secret_api_key/, '$1')
        snippets[lang][name] = { 
          prefix: "serpapi #{engine} #{shorttitle}".strip,
          body: body.split(/\n/),
          description: name.strip
        }
      end
    end
  end
end

puts "#{snippets.keys.size} languages supported"
puts "#{snippets.values.first.size} snippets per language"
snippets.each do |language, snippet|
  fn = "#{language}-snippets.json"
  s = JSON.pretty_generate(snippet)
  File.write(fn, s)
  puts "save: #{fn}"
end

exit 0