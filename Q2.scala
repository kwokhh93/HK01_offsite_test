object Q2 {
   def main(args: Array[String]) {
      var inputFile = sc.textFile(path_of_access_logfile)
      val dateRegex = "^\\d\\d\\d\\d-08-2[4-5]$" // date regex matches XXXX-08-24 or XXXX-08-25
      val size = inputFile.map(w => w.split("\t")) // split the string by tab
       .filter(w => w(0) matches dateRegex) // date check with the date regex
       .filter(w => w(3).contains(".jpg")) // check if JPG file
       .map( w => w(2).toInt).reduceLeft(_ + _) // sum up the file size
      print("The total data transfer caused by JPEG files from 24th Aug to 25th Aug: " + size)
   }
}