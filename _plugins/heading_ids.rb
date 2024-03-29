Jekyll::Hooks.register :posts, :post_render do |post|
  post.output = post.output.gsub(/<h(\d) id="([^"]*?)">(.*?)<\/h\1>/) do |match|
    level = $1
    text = $3
    id = $2.gsub("-", " ")
    "<h#{level} id='#{id}'>#{text}</h#{level}>"
  end
end