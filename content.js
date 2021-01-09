function should_fix()
{
	return document.getElementById("premiumOnlyAreaInSongs") != null;
}

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function transposeChord(chord, amount) {
    var scale = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
    var normalizeMap = {"Cb":"B", "Db":"C#", "D#":"Eb", "Fb":"E", "Gb":"F#", "G#":"Ab", "A#":"Bb",  "E#":"F", "B#":"C"}
    return chord.replace(/[CDEFGAB](b|#)?/g, function(chord) {
        var chord_new_idx = (scale.indexOf((normalizeMap[chord] ? normalizeMap[chord] : chord)) + amount) % scale.length;
        return scale[chord_new_idx < 0 ? chord_new_idx + scale.length : chord_new_idx];
    })
}

function fix_page()
{
	let chords_tags = document.getElementsByClassName("chords");
	
	for (index = 0, len = chords_tags.length; index < len; ++index) {
		let chords = chords_tags[index];
		let chords_text = chords.innerText;
		chords.innerText = transposeChord(chords_text, 1);
	}
}

function main()
{
	// Check if page marked for fixing
	let wait_for_fix = localStorage.getItem('wait_for_fix');
	
	if (wait_for_fix == 'True') {
		localStorage.removeItem('wait_for_fix');
		fix_page();
		return;
	}
	
	if (!should_fix()) {
		// Nothing to do
		return;
	}
	
	// Get current ton
	params = parseQuery(location.search);
	ton = params['ton'];
	if (ton == '') {
		ton = '0';
	}
	
	// Load the song with ton - 0.5
	new_ton = parseInt(ton) - 0.5;
	let new_url = location.protocol + '//' + location.host + location.pathname + '?ton=' + new_ton
	// let old_url_path = location.pathname + '?' + location.search
	
	// Mark page for fixing on next reload
	localStorage.setItem('wait_for_fix', 'True');
	
	// Load the new url
	location.assign(new_url);
} 

main();
