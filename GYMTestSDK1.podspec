#
#  Be sure to run `pod spec lint GYMTestSDK1.podspec' to ensure this is a
#  valid spec and to remove all comments including this before submitting the spec.
#
#  To learn more about Podspec attributes see https://guides.cocoapods.org/syntax/podspec.html
#  To see working Podspecs in the CocoaPods repo see https://github.com/CocoaPods/Specs/
#

Pod::Spec.new do |spec|
  spec.name         = "GYMTestSDK1"
  spec.version      = "0.0.1"
  spec.summary      = "A short description of GYMTestSDK1."
  spec.description  = "description"

  spec.homepage     = "http://www.baidu.com"
  spec.license          = { :type => 'MIT', :file => 'LICENSE' }

  spec.author             = { "gouyaming" => "gouyaming@qiyi.com" }

  spec.source       = { :git => "https://github.com/gouyaming/GYMTestSDK1.git", :tag => "#{spec.version}" }

  spec.source_files  = "include/*.h"
  spec.exclude_files = "Classes/Exclude"
end
